//@ts-ignore
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
//@ts-ignore
import { getErrorResponse, getResponse, databaseClient } from 'AppLayer';

export const main = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try{

    const _headers:any = event.headers??{};
    const _params:any = event.pathParameters??{};
    const _body = (event.body && typeof event.body === 'string') ? JSON.parse(event.body) : event;

    const dbClient:any = await databaseClient();

    await dbClient.close();

    return getResponse(200, { error: false, data:{message:"test"} });

  }catch(error:any){
    console.error("ERROR::::: ",error);

    return getErrorResponse(
      error.httpCode??500,
      error.message,
      error.service??"[sm-service:track1:track2:general]",
      error.data??error?.response?.data??[]
    );
  }
};