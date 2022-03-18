import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";

import controller from "../../../controllers/posts";
import { catchAsyncError, generateResponse } from "../../../utils";
import upload from "../../../utils/upload";

const handler = nc<NextApiRequest, NextApiResponse>({
  onNoMatch: (req, res) => generateResponse("405", `Request type ${req.method} is not allowed.`, res),
})
  .use(upload().array("image"))
  .get(catchAsyncError(controller.getRequestHandler))
  .post(catchAsyncError(controller.postRequestHandler));

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
