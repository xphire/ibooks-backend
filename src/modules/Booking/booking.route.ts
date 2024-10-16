import { FastifyInstance, RouteOptions } from "fastify";
import {
  createBookingSession,
  paystackConfirmPayment,
  paystackWebhookController,
  fetchBookingById,
  fetchUserBoookings
} from "./booking.controller";
import { userAuthController } from "../../Auth/auth.controller";
import { createBookingSession as BookingSessionSchema } from "./booking.schema";

const createBookingRouteOptions: RouteOptions = {
  method: "POST",
  url: "/booking",
  schema: {
    body: BookingSessionSchema,
  },
  onRequest: userAuthController,
  handler: createBookingSession,
};

const paystackWebhookRouteOptions: RouteOptions = {
  method: "POST",
  url: "/payments/webhook/paystack",
  handler: paystackWebhookController,
};

const paystackConfirmPaymentRouteOptions: RouteOptions = {
  method: "GET",
  url: "/payments/confirm/paystack/:reference",
  onRequest: userAuthController,
  handler: paystackConfirmPayment,
};


const fetchUserBookingsRouteOptions : RouteOptions = {

    method : 'GET',
    url : '/mybookings',
    onRequest : userAuthController,
    handler : fetchUserBoookings
}

const fetchBookingByIdRouteOptions : RouteOptions = {


     method : 'GET',
     url : '/booking/:bookingId',
     onRequest : userAuthController,
     handler : fetchBookingById
}

export function bookingRoutes(
  app: FastifyInstance,
  _: unknown,
  done: () => void
) {
  app.route(createBookingRouteOptions);

  app.route(paystackWebhookRouteOptions);

  app.route(paystackConfirmPaymentRouteOptions);

  app.route(fetchUserBookingsRouteOptions)

  app.route(fetchBookingByIdRouteOptions)

  done();
}
