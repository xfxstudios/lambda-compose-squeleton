/* eslint-disable no-async-promise-executor */
import mongoose from "mongoose";
// eslint-disable-next-line @typescript-eslint/no-unused-vars


export interface IDatabaseUtil {
  createUser(body:any):Promise<any>
  getAllUsers(page:number, size:number, param:string):Promise<any>
  validUserExists(param:string[], properties:string[]):Promise<any>
}

class DatabaseUtil {

  protected username:string
  protected password:string
  protected host:string
  protected port:string
  protected dbname:string
  protected client:any

  constructor(){
    this.username = process.env.DATABASE_USERNAME!
    this.password = process.env.DATABASE_PASSWORD!
    this.host = process.env.DATABASE_HOST!
    this.port = process.env.DATABASE_PORT!
    this.dbname = process.env.DATABASE_NAME!
    this.client = null
  }
  
  async _connect():Promise<this>{
    const _uri=`mongodb://${this.username}:${this.password}@${this.host}:${this.port}/${this.dbname}`
    const _options={
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        retrywrites: false,
        tls: false,
        tlsAllowInvalidCertificates: true,
        directConnection: true,
        authSource: 'admin',
        serverSelectionTimeoutMS:10000
    }

    mongoose.connection.on('connected', () =>console.log("DATABASE: [CONNECTED]"))
    mongoose.connection.on('open', () =>console.log("DATABASE: [OPEN] "))
    mongoose.connection.on('disconnecting', () =>console.log("DATABASE: [DISCONECTING] "))
    mongoose.connection.on('disconnected', () =>console.log("DATABASE: [DISCONECTED] "))
    mongoose.connection.on('reconnected', () =>console.log("DATABASE: [RECONECTED] "))
    mongoose.connection.on('close', () =>console.log("DATABASE: [CLOSED] "))
    mongoose.connection.on('error', (error:any) =>console.log("DATABASE: [ERROR] ", error))


    try {      
        this.client = await mongoose.connect(_uri,_options)
        return this
    } catch(err:any) {
        await console.log("Mongo Connection Fail",err)
        throw new Error(`DB Authentication error: ${err.message}`)
    }
  }

  async close(){
    try{
      console.log("DATABASE: [CLOSING]")
      await mongoose.connection.close();
      await mongoose.connection.removeAllListeners();
    }catch(e:any){
      throw new Error(e.message)
    }
  }



}//end class


export const databaseClient = async () => {
  return new Promise((resolve, reject) => {
      const _db = new DatabaseUtil()
      _db._connect()
      .then((client) => resolve(client))
      .catch((e) => reject(e))
  })
}