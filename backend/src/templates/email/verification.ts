const registrationOtpTemplate = (OTP: number, expiryInMinutes: number) => {
    return `
        <div style="margin:0;padding:0;background-color:#f4f4f7;font-family:Arial,Helvetica,sans-serif;color:#333333;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f4f7;padding:40px 20px;">
            <tr>
            <td align="center">

                <table role="presentation" width="600" cellspacing="0" cellpadding="0"
                style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.08);"
                >

                <!-- Header -->
                <tr>
                    <td align="center" style="padding:32px;background:#4f46e5;color:#ffffff;">
                    <h1 style="margin:0;font-size:28px;font-weight:bold;">
                        Besties
                    </h1>
                    </td>
                </tr>

                <!-- Content -->
                <tr>
                    <td style="padding:40px 32px;">
                    <h2 style="margin:0 0 20px;font-size:24px;color:#111827;">
                        Verify Your Email
                    </h2>

                    <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">
                        Hi,
                    </p>

                    <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">
                        Welcome to <strong>Besties</strong>! We're excited to have you
                        onboard.
                    </p>

                    <p style="margin:0 0 30px;font-size:16px;line-height:1.6;">
                        Use the verification code below to complete your registration:
                    </p>

                    <!-- OTP -->
                    <table
                        role="presentation"
                        align="center"
                        cellspacing="0"
                        cellpadding="0"
                        style="margin:0 auto 30px;"
                    >
                        <tr>
                        <td
                            style="
                            background:#eef2ff;
                            border:2px dashed #4f46e5;
                            border-radius:10px;
                            padding:18px 36px;
                            font-size:34px;
                            font-weight:bold;
                            letter-spacing:8px;
                            color:#4f46e5;
                            text-align:center;
                            "
                        >
                            ${OTP}
                        </td>
                        </tr>
                    </table>

                    <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">
                        This code will expire in
                        <strong>${expiryInMinutes} minutes</strong>.
                    </p>

                    <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;"/>

                    <p style="margin:0 0 10px;font-size:14px;color:#6b7280;line-height:1.6;">
                        <strong>Security Reminder</strong>
                    </p>

                    <ul
                        style="
                        margin:0;
                        padding-left:20px;
                        color:#6b7280;
                        font-size:14px;
                        line-height:1.8;
                        "
                    >
                        <li>Never share your OTP with anyone.</li>
                        <li>Besties will never ask for your OTP.</li>
                        <li>If you didn't create this account, simply ignore this email.</li>
                    </ul>
                    </td>
                </tr>
                <!-- Footer -->
                <tr>
                    <td align="center" style="padding:24px; background:#f9fafb; color:#9ca3af; font-size:13px;">
                    © 2026 Besties. All rights reserved.
                    </td>
                </tr>
                </table>
            </td>
            </tr>
        </table>
        </div>
    `;
};

const forgotPasswordOtpTemplate = (OTP: number, expiryInMinutes: number) => {
    return `
        <body style="margin:0; padding:0; background-color:#f5f5f5; font-family:Arial, Helvetica, sans-serif; color:#333333;"> <div style="max-width:500px; margin:40px auto; background:#ffffff; padding:32px; border-radius:8px;">

            <h2 style="margin:0 0 16px; color:#111111;">Reset Your Password</h2>

            <p style="margin:0 0 20px; font-size:15px; line-height:1.6;">
            We received a request to reset your password. Use the OTP below to continue:
            </p>

            <div style="margin:24px 0; padding:16px; background:#f3f4f6; text-align:center; border-radius:6px;">
            <span style="font-size:28px; font-weight:bold; letter-spacing:6px; color:#111111;">
                ${OTP}
            </span>
            </div>

            <p style="margin:0 0 12px; font-size:14px; color:#555555;">
            This OTP is valid for <strong>${expiryInMinutes} minutes</strong>.
            </p>

            <p style="margin:0; font-size:14px; color:#777777; line-height:1.5;">
            If you didn't request a password reset, you can safely ignore this email.
            </p>

            <p style="margin:28px 0 0; font-size:14px; color:#555555;">
            Regards,<br>
            <strong>Besties Team</strong>
            </p>

            </div> 
        </body>
    `;
};

export default { registrationOtpTemplate, forgotPasswordOtpTemplate };
