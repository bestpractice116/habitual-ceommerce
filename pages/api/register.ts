import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../utils/prisma";
import { RequestType } from "../../utils/types";
import { checkRequestType, generateResponse, hashPhassword } from "../../utils";
import { validateUserCred } from "../../utils/validation";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  checkRequestType("POST", req.method as RequestType, res);

  try {
    const user = req.body || {};
    const validationResponse = await validateUserCred(user);

    if (validationResponse) {
      return generateResponse("400", "Invalid input provided.", res, validationResponse);
    }

    user.password = await hashPhassword(user.password);

    await prisma.user.create({
      data: user,
    });

    return generateResponse("200", "Your account is successfully created.", res);
  } catch (error) {
    return generateResponse("400", "Something went wrong.", res);
  }
};
