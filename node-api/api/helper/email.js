const nodemailer = require("nodemailer");

// async function SendMail() {
exports.SendMail = async (to, subject, message) => {
  try {
    messageBody = await getEmailBodyResetPassworduserId(message);
    let transporter = nodemailer.createTransport({
      host: "smtp.titan.email",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "no-reply@bethereapp.net", // generated ethereal user
        pass: "4mt9@dmin!5^R723", // generated ethereal password
      },
    });

    let info = await transporter.sendMail({
      from: "no-reply@bethereapp.net", // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      html: message, // html body
    });
    return info;
  } catch (err) {
    console.log(err);
    return err;
  }
};

function getEmailBodyResetPassworduserId(userId) {
  let url = process.env.URL + "uploads/logo.png";
  let site_url = process.env.SITE_URL + "reset-password/" + userId;
  let emailBody = `<tbody>
   <tr>
      <td style="direction:ltr;font-size:0px;padding:20px 0;padding-left:15px;padding-right:15px;text-align:center;">
         <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
               <tr>
                  <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                     <div style="font-size:24px;font-weight:bold;line-height:24px;text-align:center;color:#323232;"> Reset Password </div>
                  </td>
               </tr>
               <tr>
                  <td align="left" style="font-size:0px;padding:10px 25px 0px 25px;word-break:break-word;">
                     <div style="font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">We received a request to reset your password.</div>
                  </td>
               </tr>
               <tr>
                  <td align="left" style="font-size:0px;padding:10px 25px 0px 25px;word-break:break-word;">
                     <div style="font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">Your userId to reset the password for this session is </div>
                  </td>
               </tr>
            </table>
            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top; margin:30px 0px;" width="100%">
               
               <tr>
                  <td align="left" style="font-size:0px;padding:0 25px;word-break:break-word;">
                     <div style="font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">
                        <p style="font-size: 22px; color: #000000"> ${userId}</p>
                        <br/><br/> If you get any kind of problem while using Megabox app then feel free to contact us on <a href="mailto:support@megabox.com" title="Megabox Support">support@megabox.com</a> 
                     </div>
                  </td>
               </tr>
            </table>
         </div>
      </td>
   </tr>
   <tr>
      <td style="font-size:0px;padding:10px 25px;word-break:break-word;">
         <p style="border-top:solid 1px #DFE3E8;font-size:1;margin:0px auto;width:100%;"></p>
      </td>
   </tr>
 </tbody>`;
  return emailBody;
}

// Function to generate email with respective domains
exports.generateEmail = async (uid, signupType) => {
  const domainName = {
    2: "apple.com",
    3: "google.com",
    4: "linkedin.com",
    5: "facebook.com",
  };

  const domain = domainName[signupType];
  if (!domain) {
    throw new Error("Invalid signupType");
  }

  const formattedEmail = `${uid}@${domain}`;
  return formattedEmail;
};
