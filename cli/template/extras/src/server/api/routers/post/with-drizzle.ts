import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { posts } from "~/server/db/schema";

export const createPost = publicProcedure
  .input(z.object({ text: z.string().min(1) }))
  .mutation(async ({ ctx, input }) => {
    // simulate a slow db call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await ctx.db.insert(posts).values({ text: input.text });
  });

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: createPost,

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.post.findFirst({
      orderBy: { createdAt: "desc" },
    });
  }),
});