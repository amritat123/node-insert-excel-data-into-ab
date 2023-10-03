const moment = require("moment");
const fs = require("fs");
// const AdminActionDB = require("../models/admin_action");
const admin = require("firebase-admin");
const axios = require("axios");
const FormData = require("form-data");
// var serviceAccount = require("../../localmenu-app-firebase-adminsdk-1axnt-140819bd72.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://localmenu-app-default-rtdb.firebaseio.com",
// });

exports.AdminAction = async (
  admin_id,
  module_id,
  module_name,
  module_data,
  action
) => {
  const add = await new AdminActionDB({
    admin_id,
    module_id,
    module_name,
    module_data,
    action,
  }).save();
  return add;
};

exports.generateRandomString = (length, isNumber = false) => {
  var result = "";
  if (isNumber) {
    var characters = "0123456789";
  } else {
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  }
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
  z;
};

exports.getValidImageUrl = async (filename, name = "SH") => {
  console.log(true);
  if (filename === "" || filename === undefined || filename === null) {
    filename =
      "https://ui-avatars.com/api/?name=" +
      name +
      "&rounded=true&background=c39a56&color=fff&format=png";
  } else {
    filename = process.env.URL + "uploads/blog/coverPhotos/" + filename;
  }
  return filename;
};

exports.getImageUrl = async (filename, name = "SH") => {
  if (filename === "" || filename === undefined || filename === null) {
    filename =
      "https://ui-avatars.com/api/?name=" +
      name +
      "&rounded=true&background=c39a56&color=fff&format=png";
  } else {
    filename = process.env.URL + filename;
  }
  return filename;
};

exports.writeErrorLog = async (req, error) => {
  const requestURL = req.protocol + "://" + req.get("host") + req.originalUrl;
  const requestBody = JSON.stringify(req.body);
  const date = moment().format("MMMM Do YYYY, h:mm:ss a");
  fs.appendFileSync(
    "errorLog.log",
    "REQUEST DATE : " +
      date +
      "\n" +
      "API URL : " +
      requestURL +
      "\n" +
      "API PARAMETER : " +
      requestBody +
      "\n" +
      "Error : " +
      error +
      "\n\n"
  );
};

exports.getSlugName = (title) => {
  const titleLOwerCase = title.toLowerCase();
  const slug = titleLOwerCase.replace(/ /g, "-");
  return slug;
};

exports.toCapitalize = (str) => {
  let first = str.toUpperCase();

  return first;
};

exports.capitalizeFullString = (str) => {
  return str
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

exports.call_msg_notification = async (title, body) => {
  const topic = "LocalMenu";

  // const message = {
  //   notification: {
  //     title: title,
  //     body: body,
  //   },
  //   android: {
  //     notification: {
  //       sound: "default",
  //       click_action: "MainActivity",
  //     },
  //   },
  //   apns: {
  //     payload: {
  //       aps: {
  //         sound: "default",
  //       },
  //     },
  //   },
  //   topic: topic,
  // };
  const payload = {
    notification: {
      title: title,
      body: body,
    },
  };

  const options = {
    priority: "high",
    timeToLive: 60 * 60 * 24, // 1 day
  };

  // Send the message to the topic
  await admin
    .messaging()
    .sendToTopic(topic, payload, options)
    .then((response) => {
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });

  // await admin
  //   .messaging()
  //   .listTopics()
  //   .then((response) => {
  //     console.log(response.topics);
  //   })
  //   .catch((error) => {
  //     console.log("Error listing topics:", error);
  //   });
};

exports.call_msg_ios_notification = async (registration_ids, messages) => {
  const message = {
    notification: {
      title: messages.title,
      body: messages.body,
    },
    tokens: registration_ids,
    apns: {
      payload: {
        aps: {
          sound: "default",
          badge: Number(messages.bedge),
        },
      },
    },
    data: {
      type: String(messages.type),
      chat_id: messages.chat_id ? String(messages.chat_id) : "",
    },
  };

  admin
    .messaging()
    .sendMulticast(message)
    .then(async (result) => {
      console.log(result);
    })
    .catch(async (err) => {
      console.log(err);
    });
};

exports.getPlaceIdApi = (query) => {
  return new Promise(async (resolve, reject) => {
    try {
      await axios
        .get("https://maps.googleapis.com/maps/api/place/textsearch/json", {
          params: {
            query: query,
            key: process.env.GOOGLE_API_KEY,
            language: "en",
          },
        })
        .then((res) => {
          // console.log("res:", res.data.results[0]);
          const latitude = res.data.results[0]?.geometry?.location?.lat;
          const longitude = res.data.results[0]?.geometry?.location?.lng;
          const place_id = res.data.results[0].place_id;

          const responseData = {
            lat: latitude,
            long: longitude,
            place_id: place_id,
          };
          // console.log("responseData:", responseData);
          resolve(responseData);
        })
        .catch((err) => console.log("err in lat lng api", err));
    } catch (err) {
      console.log("err", err);
    }
  });
};

exports.TranslateLanguage = async (element, text) => {
  return new Promise(async (resolve, reject) => {
    try {
      // const language = ["EN", "DE", "UK", "IT", "RU", "ES", "FR", "KO", "ZH"];
      // const language = ["EN", "DE"];
      // for (let index = 0; index < language.length; index++) {
      //   const element = language[index];
      // console.log("element:", element);
      const formData = new FormData();
      formData.append("auth_key", process.env.TRANSLATE_API_KEY);
      formData.append("source_lang", "PL");
      formData.append("target_lang", element);
      formData.append("text", text);

      await axios
        .post(process.env.TRANSLATE_API_URL, formData, {
          headers: formData.getHeaders(),
        })
        .then((res) => {
          // console.log("res:", res.data.translations[0].text);

          const responseData = {
            text: res.data.translations[0].text,
            detected_language:
              res.data.translations[0].detected_source_language,
            current_language: element,
          };

          resolve(responseData);
        })
        .catch((err) => console.log("err in translate api", err));
      // }
    } catch (err) {
      console.log("err", err);
    }
  });
};

exports.resizeImage = async (path) => {
  try {
    if (!path.match(/\.(jpe?g|png|gif|heic)$/gi)) return;
    if (path.match(/\.(heic)$/gi)) {
      path = await heicToJpg(path);
    }
    console.log(path);
    console.time("JPG Compression Time");
    let imageDimensions = sizeOf(path);
    if (imageDimensions.width > 600) {
      Jimp.read(path).then((res) => {
        result = res
          .resize(600, Jimp.AUTO) // width height
          .quality(50) // set JPEG quality
          .write(path);
      });
      console.timeEnd("JPG Compression Time");
    }
    return path;
  } catch (err) {
    console.log(err);
  }
};

exports.forgetPasswordMail = (data) =>
  `<!DOCTYPE html>
      <html>
      
      <head>
          <title>Signup email verification OTP</title>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <link
              href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
              rel="stylesheet">
          <style>
              body,
              table,
              td,
              a {
                  -webkit-text-size-adjust: 100%;
                  -ms-text-size-adjust: 100%;
              }
      
              table,
              td {
                  mso-table-lspace: 0pt;
                  mso-table-rspace: 0pt;
              }
      
              img {
                  -ms-interpolation-mode: bicubic;
              }
      
              /* RESET STYLES */
              img {
                  border: 0;
                  height: auto;
                  line-height: 100%;
                  outline: none;
                  text-decoration: none;
              }
      
              table {
                  border-collapse: collapse !important;
              }
      
              body {
                  height: 100% !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  width: 100% !important;
              }
      
              @media screen and (max-width:600px) {
                  h1 {
                      font-size: 30px !important;
                      line-height: 34px !important;
                  }
      
                  h2 {
                      font-size: 18px !important;
                      line-height: 26px !important;
                  }
      
                  .profile {
                      width: 180px;
                  }
              }
          </style>
      </head>
      
      <body style="margin: 0 !important; padding: 0 !important; font-family: 'Rubik', sans-serif;">
          <div style="max-width: 900px; margin: 0 auto; padding: 0; width: 100%;">
              <table border="0" bgcolor="#566DCB" cellpadding="0" cellspacing="0" width="100%">
      
                  <tr>
                      <td bgcolor="#000" align="center" style="padding-top: 30px; padding-bottom: 25px;">
                          <h1
                              style="font-family: 'Rubik', sans-serif; font-size:40px; line-height:48px; color: #fff; padding-bottom: 15px; margin: 0;">
                              BeThere. </h1>
      
                      </td>
                  </tr> <!-- body content -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tbody>
                          <tr>
                              <td bgcolor="#fff"
                                  style="padding: 19px 33px 16px 33px; font-size: 20px; line-height: 28px;color: #200E32; text-align: center;">
                                  <h2 style="margin: 0; ">Forgot password verification code!</h2>
                              </td>
                          </tr>
                          <tr>
                              <td bgcolor="#fff" style="padding: 0 33px 28px 33px; color: #000; ">
                                  <p style="font-size:20px; line-height: 28px; margin: 0;">It's seem you have requested for forgot password</p>
                                  <p style="font-size:20px; line-height: 28px; margin: 0;">Here is verification code. Please
                                      copy it and verify your email and change your password .</p>
                              </td>
                          </tr>
                          <tr>
                              <td bgcolor="#000" style="padding: 0; margin-bottom: 28px; text-align: center; color: #fff; ">
                                  <h2>CODE: ${data.otp}</h2>
                              </td>
                          </tr>
                          <tr>
                              <td bgcolor="#fff" style="padding: 28px 33px 10px 33px; color: #200E32; ">
                                  <p style="font-size:20px; line-height: 28px; margin: 0;">Regards, <br> Team BeThere App</p>
                              </td>
                          </tr>
                      </tbody>
                  </table> <!-- footer -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tbody>
                          <tr>
                              <td align="center" bgcolor="#000" style="padding: 12px; color: #fff;">
                                  <p style="text-align: center; font-size: 14px; line-height: 20px; margin: 0;"> Sent by
                                      BeThere. | Copyright BeThere., 2023 </p>
                              </td>
                          </tr>
                      </tbody>
                  </table>
              </table>
          </div>
      </body>
      
      </html>`;
