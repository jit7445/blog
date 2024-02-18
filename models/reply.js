const { Schema, model } = require("mongoose");
const replySchema=new Schema(
    {
      content: {
        type: String,
      //   required: true,
      },
      commentId:{
        type:Schema.Types.ObjectId,
        ref:"comment"
      },
      blogId:{
        type: Schema.Types.ObjectId,
        ref: "blog",
      },
      createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    },
    { timestamps: true }
  );
  
  const reply = model("reply", replySchema);
  
  module.exports = reply;