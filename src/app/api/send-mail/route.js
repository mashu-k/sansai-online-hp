import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json();

    // トランスポーターの作成
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // メールの内容
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: 'sansaitorionline@gmail.com', // 送信先
      replyTo: email, // 返信先を問い合わせた人のアドレスに設定
      subject: `【Webサイトからのお問い合わせ】${subject}`,
      text: `
以下の内容でお問い合わせがありました。

名前: ${name}
メールアドレス: ${email}
件名: ${subject}

メッセージ:
${message}
      `,
      html: `
        <h3>お問い合わせがありました</h3>
        <p><strong>名前:</strong> ${name}</p>
        <p><strong>メールアドレス:</strong> ${email}</p>
        <p><strong>件名:</strong> ${subject}</p>
        <br>
        <p><strong>メッセージ:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    // メール送信
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
