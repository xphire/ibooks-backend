import { FastifyReply, FastifyRequest } from "fastify";
import { AppDataSource as dataSource } from "../../data-source";
import { createBookingSession as BookingSessionSchema } from "./booking.schema";
import { Hotel } from "../Hotel/hotel.model";
import { Booking } from "./booking.model";
import { User } from "../User/user.model";
import { BookingStatus } from "./booking.model";
import config from "config";
import axios from "axios";
import crypto from "crypto";

export type PaystackEvents = {
  event: string;
  data: {
    reference: string;
  };
};

export async function createBookingSession(
  request: FastifyRequest,
  response: FastifyReply
) {
  //validate request body

  // return response.status(201).send({

  // reference: '1caf7049-9974-4f53-a35d-6f70d392d0f2',
  // url: 'https://checkout.paystack.com/8a7vuct2jxdv1kn'

  // })

  const body = BookingSessionSchema.parse(request.body);

  //fetch hotel

  const hotel = await dataSource.manager.findOneBy(Hotel, {
    id: body.hotelId,
  });

  if (!hotel) {
    return response
      .status(400)
      .send({ status: "failed", message: "failed to retrieve hotel" });
  }

  //fetch user

  const user = await dataSource.manager.findOneBy(User, {
    id: request.userId,
  });

  if (!user) {
    return response
      .status(400)
      .send({ status: "failed", message: "failed to retrieve user" });
  }

  //check adult and child count

  if (
    body.adultCount > hotel.adultCount ||
    body.childCount > hotel.childCount
  ) {
    return response
      .status(400)
      .send({ status: "failed", message: "kindly regularize guest counts" });
  }

  //check checkin and checkout date

  if (body.checkInDate.split("T")[0] === body.checkOutDate.split("T")[0]) {
    return response.status(400).send({
      status: "failed",
      message: "check in and check out dates cannot be the same",
    });
  }

  //calculate total amount

  const totalAmount =
    parseFloat((body.numberOfNights * hotel.pricePerNight).toFixed(2)) * 100;

  const booking = new Booking();

  booking.status = "placed" as BookingStatus;
  booking.hotelId = body.hotelId;
  booking.userId = request.userId;
  booking.totalAmount = totalAmount;
  booking.numberOfNights = body.numberOfNights;
  booking.adultCount = body.adultCount;
  booking.childCount = body.childCount;
  booking.firstName = user.firstName;
  booking.lastName = user.lastName;
  booking.checkInDate = body.checkInDate;
  booking.checkOutDate = body.checkOutDate;
  booking.lastUpdated = new Date().toISOString();
  booking.email = user.email;

  const savedBooking = await dataSource.manager.save(booking);

  //paystack payload

  const payload = {
    email: user.email,
    amount: totalAmount,
    currency: "NGN",
    reference: savedBooking.id,
    callback_url: `${config.get("frontend_url")}/my-bookings`,
  };

  const session = await axios.post(
    "https://api.paystack.co/transaction/initialize",
    payload,
    {
      headers: {
        Authorization: `Bearer ${config.get("paystack_secret_key")}`,
        "Content-Type": "application/json",
      },
    }
  );

  const result = await session.data;

  return response.status(201).send({
    reference: result.data.reference,
    url: result.data.authorization_url,
  });
}

export async function paystackWebhookController(
  request: FastifyRequest,
  response: FastifyReply
) {
  //event validation

  const hash = crypto
    .createHmac("sha512", config.get("paystack_secret_key"))
    .update(JSON.stringify(request.body))
    .digest("hex");

  const sourceDomains = ["52.31.139.75", "52.49.173.169", "52.214.14.220"];

  if (
    hash !== request.headers["x-paystack-signature"] ||
    !sourceDomains.includes(request.ip)
  ) {
    return response.status(400);
  }

  const { event, data } = request.body as PaystackEvents;

  if (event === "charge.success") {
    //response.send(200)

    //update booking info and last updated

    const { reference } = data;

    const booking = await updateStatusToPaid(reference);

    if (!booking) {
      return response.status(400);
    }

    return response.status(200);
  }
}

export async function paystackConfirmPayment(
  request: FastifyRequest,
  response: FastifyReply
) {
  const { reference } = request.params as { reference: string };

  //fetch booking and check if status is paid or canceled

  const booking = await dataSource.manager.findOneBy(Booking, {
    id: reference,
  });

  if (!booking) {
    return response
      .status(400)
      .send({ status: "failed", message: "payment verification failed" });
  }

  if (booking.status !== "placed") {
    return response
      .status(200)
      .send({ status: "success", message: "payment already verified" });
  }

  const verify = await axios.get(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${config.get("paystack_secret_key")}`,
      },
    }
  );

  if (verify.data.data.status === "success") {
    await updateStatusToPaid(reference);

    return response
      .status(200)
      .send({ status: "success", message: "payment successfully verified" });
  }

  return response
    .status(400)
    .send({ status: "failed", message: "payment not verified" });
}

export async function fetchBookingById(
  request: FastifyRequest,
  response: FastifyReply
) {
  const { bookingId } = request.params as { bookingId: string };

  const booking = await dataSource.manager.findOneBy(Booking, {
    id: bookingId,
  });

  if (!booking) {
    return response
      .status(404)
      .send({ status: "failed", message: "booking not found" });
  }

  return response.status(200).send(booking);
}

export async function fetchUserBoookings(
  request: FastifyRequest,
  response: FastifyReply
) {
  const { userId } = request;

  // const bookings = await dataSource.manager.findBy(Booking, {
  //   userId: userId
  // });

  
  const bookings = await dataSource.getRepository(Hotel).find({

    relations : {
      bookings : true
    },
    where : {
       bookings: {
          userId : userId
       }
    },
    order : {
      id : 'desc'
    }
})

  return response.status(200).send(bookings);
}

async function updateStatusToPaid(reference: string): Promise<Booking | null> {
  const booking = await dataSource.manager.findOneBy(Booking, {
    id: reference,
    
  });

  if (!booking) return null;

  const updatedBooking = {
    ...booking,
    lastUpdated: new Date().toISOString(),
    status: "paid" as BookingStatus,
  };

  await dataSource.manager.save(Booking, {
    ...updatedBooking,
  });

  return updatedBooking;
}
