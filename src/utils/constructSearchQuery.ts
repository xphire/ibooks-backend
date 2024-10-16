//This constructs the search query used in pulling hotels from the frontend

import { MoreThanOrEqual, LessThanOrEqual, In, ArrayContains } from "typeorm";
import { SearchQuery } from "../modules/Hotel/hotel.schema";
//import { Hotel } from "../modules/Hotel/hotel.model";

export default function constructSearchQuery (searchQuery : SearchQuery){

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query : any = {}
    

    if(searchQuery.adultCount){

        if(isNaN(searchQuery.adultCount as unknown as number) || isNaN(parseInt(searchQuery.adultCount))){

            query.adultCount =  MoreThanOrEqual(1)
        }
        else{

            query.adultCount =   MoreThanOrEqual(parseInt(searchQuery.adultCount))

        }

    }
    

    if(searchQuery.childCount){

        if(isNaN(searchQuery.childCount as unknown as number) || isNaN(parseInt(searchQuery.childCount))){

            query.childCount =  MoreThanOrEqual(1)
        }
        else{

            query.childCount =   MoreThanOrEqual(parseInt(searchQuery.childCount))

        }
    }
    

    if(searchQuery.facilities){

        if(Array.isArray(searchQuery.types)){

            query.facilities =  ArrayContains(searchQuery.facilities)
        }else{

            query.facilities = ArrayContains([searchQuery.facilities])
        }


    }

    if(searchQuery.types){

        if(Array.isArray(searchQuery.types)){

            query.type =  In(searchQuery.types)
        }else{

            query.type = searchQuery.types
        }


    }

    if (searchQuery.stars){

        if(Array.isArray(searchQuery.stars)){

            query.starRating =  In(searchQuery.stars)
        }else{

            query.starRating = searchQuery.stars
        }

        
    }

    if(searchQuery.maxPrice){

        query.pricePerNight = LessThanOrEqual(parseInt(searchQuery.maxPrice))

    }


    if (searchQuery.destination){

        return [
            {...query, country : searchQuery.destination},
            {...query, city : searchQuery.destination},
            
        ]
    }



    return query


}