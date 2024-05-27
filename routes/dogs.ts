import Router, { RouterContext } from "koa-router";
import bodyParser from "koa-bodyparser";
import * as model from '../models/dogs.model';
import { basicAuth } from '../controllers/auth';
import { validateDog } from '../controllers/validation';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { config } from '../config';

const router = new Router({ prefix: '/api/v1/dogs' });


const getAll = async (ctx: RouterContext, next: any) => {

  const dogs = await model.getAll();
  if (dogs.length) {
    ctx.body = dogs;
  } else {
    ctx.body = {};
  }
  await next();
}

const getById = async (ctx: RouterContext, next: any) => {
  const id = +ctx.params.id;
  const dogs = await model.getById(id);
  if (dogs.length)
    ctx.body = dogs[0];
  else
    ctx.status = 404;

  await next();
}

const searchDogs = async (ctx: RouterContext, next: any) => {
  const searchFields: Record<string, string> = ctx.query as Record<string, string>;
  const operator: 'AND' | 'OR' | string = Array.isArray(ctx.query.operator) ? ctx.query.operator[0] : ctx.query.operator || 'AND';
  try {
    const dogs = await model.searchByFields(searchFields, operator as 'AND' | 'OR');
    ctx.body = dogs;

    if (dogs.length) {
      ctx.status = 200;
    } else {
      ctx.status = 404;
    }
  } catch (err) {
    ctx.status = 500;
    ctx.body = { error: 'An error occurred during the search' };
  }

  await next();
}



const createDog = async (ctx: RouterContext, next: any) => {
  const body = ctx.request.body;
  const result = await model.add(body);
  if (result.status == 201) {
    ctx.status = 201;
    ctx.body = body;

    console.log(body);
    const message = `A new dog ${body.name} has been added. Please check it out the website!`;
    console.log(message);
    try {
      const response = await fetch(`https://graph.facebook.com/${config.facebook_page_id}/feed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.facebook_access_token}`
        },
        body: JSON.stringify({ message })
      });

      console.log(response.json());
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: error.message };
    }
  } else {
    ctx.status = 500;
    ctx.body = { err: "insert data failed" };
  }

  // post to fb


  await next();
}

const updateDog = async (ctx: RouterContext, next: any) => {
  const body = ctx.request.body;
  const id = +ctx.params.id;
  const userId = ctx.state.user.user.id;

  const result = await model.update(body, id, userId);

  if (result.status == 201) {
    ctx.status = 201;
    ctx.body = body;
  } else {
    ctx.status = 500;
    ctx.body = { err: "update data failed" };
  }

  await next();
};


const deleteDog = async (ctx: RouterContext, next: any) => {
  const id = +ctx.params.id;
  const result = await model.deleteById(id);
  if (result.status == 200) {
    ctx.status = 200;
    ctx.body = id;
  } else {
    ctx.status = 500;
    ctx.body = { err: "delete data failed" };
  }
  await next();
}

// Upload a photo for a specific dog
const uploadPhoto = async (ctx: RouterContext, next: any) => {
  const id = +ctx.params.id;
  const filePath = 'uploads/';
  let originalFileName = '';
  let newFileName = '';

  // Multer middleware setup for handling file uploads
  const storage = multer.diskStorage({
    destination: filePath,
    filename: (_, file, cb) => {
      const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
      originalFileName = file.originalname;
      newFileName = `${id}_${timestamp}_${originalFileName}`;
      cb(null, newFileName);
    }
  });
  const upload = multer({ storage }).single('photo');

  // Call the multer middleware to handle the file upload
  await (async () => {
    return new Promise<void>((resolve, reject) => {
      upload(ctx.req, ctx.res, async (err: any) => {
        if (err) {
          ctx.status = 400;
          ctx.body = { error: 'File upload failed' };
          reject(err);
        } else {
          try {
            // Call the model function to update the dog's photo
            await model.updatePhoto(id, filePath, originalFileName, newFileName);

            ctx.status = 200;
            ctx.body = { message: 'Photo uploaded successfully', newFileName };
            resolve();
          } catch (error) {
            ctx.status = 500;
            ctx.body = { error: 'An error occurred while uploading the photo' };
            reject(error);
          }
        }
      });
    });
  })();

  await next();
};

const getPhotos = async (ctx: RouterContext, next: any) => {
  const id = +ctx.params.id;
  try {
    const photo = await model.getPhotosById(id);
    let photoPath = path.join('uploads', 'Photo_Not_Available.jpg');
    if (photo[0].new_filename != null) {
      photoPath = path.join('uploads', photo[0].new_filename);
    }
    const photoBuffer = await fs.promises.readFile(photoPath);
    ctx.set('Content-Type', 'image/*');
    ctx.body = photoBuffer;
    ctx.status = 200;
  } catch (err) {
    ctx.status = 500;
    ctx.body = { error: 'An error occurred while retrieving the photo' };
  }
  await next();
};

const getPhotosByName = async (ctx: RouterContext, next: any) => {
  const fileName = ctx.query.name;
  if (!fileName) {
    ctx.status = 400;
    ctx.body = { error: 'File name parameter is missing' };
    return await next();
  }

  try {
    const photoPath = path.join('uploads', fileName);
    const photoBuffer = await fs.promises.readFile(photoPath);

    ctx.set('Content-Type', 'image/*');
    ctx.body = photoBuffer;
    ctx.status = 200;
  } catch (err) {
    ctx.status = 404;
    ctx.body = { error: 'Photo not found' };
  }

  await next();
};

const postToFacebook = async (ctx: RouterContext, next: any) => {
  const { message } = ctx.request.body;

  try {
    const response = await fetch(`https://graph.facebook.com/v20.0/me/feed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.facebook_access_token}`
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    ctx.body = data;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
}

const getAllBreeds = async (ctx: RouterContext, next: any) => {
  const breeds = await model.getAllBreeds();
  if (breeds.length) {
    ctx.body = breeds;
  } else {
    ctx.body = {};
  }
  await next();
}




router.get('/', getAll);
router.post('/', basicAuth, bodyParser(), validateDog, createDog);
router.get('/:id([0-9]{1,})', getById);
router.put('/:id([0-9]{1,})', basicAuth, bodyParser(), validateDog, updateDog);
router.del('/:id([0-9]{1,})', basicAuth, deleteDog);
router.get('/search', searchDogs);

router.put('/:id([0-9]{1,})/upload-photo', basicAuth, uploadPhoto);
router.get('/:id([0-9]{1,})/photos', getPhotos);
router.get('/photos', getPhotosByName);

router.post('/post-to-facebook', postToFacebook);

router.get('/breeds', getAllBreeds);



export { router };