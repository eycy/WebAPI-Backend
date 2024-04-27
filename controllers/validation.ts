import { Validator, ValidationError } from 'jsonschema';
import { RouterContext } from 'koa-router';
import { dog } from '../schema/dog.schema';

interface DogRequestBody {
  name: string;
  description: string;
  breed_id: number;
  location: string;
  dob: Date;
  imageURL: string;
  authorID: number;
}

const v = new Validator();

export const validateDog = async (ctx: RouterContext, next: any) => {
  const validationOptions = {
    throwError: true,
    allowUnknownAttributes: false
  }
  const body: DogRequestBody = ctx.request.body as DogRequestBody;

  // Perform type conversion on breed_id if it exists
  // if (body.breed_id) {
  //   body.breed_id = parseInt(body.breed_id.toString());
  // }

  try {
    v.validate(body, dog, validationOptions);
    await next();
  } catch (error) {
    if (error instanceof ValidationError) {
      ctx.body = error;
      ctx.status = 400;
    } else {
      throw error;
    }
  }
}