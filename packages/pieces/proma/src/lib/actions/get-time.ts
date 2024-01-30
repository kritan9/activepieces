import { createAction } from '@activepieces/pieces-framework';
import { promaProps } from '../common/props';
import { createNewDate, timeDiff } from '../common/data';

export const getTime = createAction({
  name: 'get_time',
  displayName: 'Get Current DateTime',
  description: 'get the current datetime in given timezone and format',
  auth:undefined,
  props: {
    timeFormat: promaProps.time_format(),
    timeZone: promaProps.time_zone(),
  },
  async run(context) {
    const timeFormat = context.propsValue.timeFormat;
    const timeZone = context.propsValue.timeZone as string;
    const date = new Date();

    if (typeof timeFormat !== 'string') {
      throw new Error(
        `Output format is not a string \noutput format: ${JSON.stringify(
          timeFormat
        )}`
      );
    }

    date.setMinutes(date.getMinutes() + timeDiff('UTC', timeZone));

    return { result: createNewDate(date, timeFormat) };
  },
});
