import { promaAuth } from '../..';
import { Property, createAction } from '@activepieces/pieces-framework';
import { sendMail } from '../common/data';

export const sendEmail = createAction({
  auth: promaAuth,
  name: 'send-email',
  displayName: 'Send Email',
  description: 'Send an email from PROMA.',
  props: {
    to: Property.Array({
      displayName: 'To',
      description: 'Emails of the recipients',
      required: true,
    }),
    reply_to: Property.ShortText({
      displayName: 'Reply To',
      description: 'Email to receive replies on (defaults to sender)',
      required: false,
    }),
    subject: Property.ShortText({
      displayName: 'Subject',
      description: undefined,
      required: true,
    }),
    content_type: Property.Dropdown<'text' | 'html'>({
      displayName: 'Content Type',
      refreshers: [],
      required: true,
      options: async () => {
        return {
          disabled: false,
          options: [
            { label: 'Plain Text', value: 'text' },
            { label: 'HTML', value: 'html' },
          ],
        };
      },
    }),
    content: Property.ShortText({
      displayName: 'Content',
      description: 'HTML is only allowed if you selected HTML as type',
      required: true,
    }),
  },
  run: async (context) => {
    const { auth } = context;
    const { to, reply_to, subject, content_type, content } = context.propsValue;
    const info = await sendMail(auth, {
      personalizations: (typeof to === 'string' ? [to] : to).map((x) => {
        return {
          to: [
            {
              email: (x as string).trim(),
            },
          ],
        };
      }),
      reply_to: reply_to
        ? {
            email: reply_to,
          }
        : undefined,
      subject: subject,
      content: [
        {
          type: content_type == 'text' ? 'text/plain' : 'text/html',
          value: content,
        },
      ],
    });

    return info;
  },
});
