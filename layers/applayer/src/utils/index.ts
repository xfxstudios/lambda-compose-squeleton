//@ts-ignore
import {InvokeCommand, LambdaClient} from "@aws-sdk/client-lambda";

export const testUtil = () => {
  return "testUtil"
}

export const getResponse = (code:number, body:any, headers:any=null) => {
  const response:any = {
      statusCode: code,
      headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
          'Access-Control-Allow-Headers':'Authorization,x-api-key,Content-Type,X-Amz-Security-Token',
          'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(body),
  };
  if(headers){
    response['headers'] = headers;
  }
  return response
}

export const getErrorResponse = (code:number, message:string, service:string, errors:any) => {

    const response:any = {
        statusCode: code,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
            'Access-Control-Allow-Headers':'Authorization,x-api-key,Content-Type,X-Amz-Security-Token',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({error:true,service,message,errors})
    };
    return response
}

export const executeFunction = async (lambda:string, payload:any) => {
  const lambdaClient = new LambdaClient({ region: process.env.AWS_APP_REGION });

  const _newPersonparams = {
      FunctionName: lambda,
      Payload: JSON.stringify(payload)
  };

  const _command = new InvokeCommand(_newPersonparams)
  const _response:any = await lambdaClient.send(_command)

  const _newResponse = new Blob([_response.Payload])
  return JSON.parse(await _newResponse.text())
}