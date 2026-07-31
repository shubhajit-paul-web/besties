const verificationTemplate = (OTP: number, expiryInMinutes: number) => {
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

export default verificationTemplate;
