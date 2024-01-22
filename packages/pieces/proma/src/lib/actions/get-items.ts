import { createAction } from '@activepieces/pieces-framework';
import { promaProps } from '../common/props';
import { getTableRows } from '../common/data';
import { promaAuth } from '../..';

export const getPromaTableRows = createAction({
  name: 'get_proma_table_rows',
  displayName: 'Get Rows',
  description: '',
  auth: promaAuth,
  props: {
    workspace_id: promaProps.workspace_id(true),
    table_id: promaProps.table_id(true),
    dataRow: promaProps.data_row_dynamic(true, true)
  },
  async run(context) {
    const api_key = context.auth;
    const table_id = context.propsValue.table_id;
    const dataRow = context.propsValue.dataRow;
    if (api_key && table_id) {
      const temp = await getTableRows(api_key, table_id, dataRow).catch(() => []);
      return temp;
    }
    return { rows: [] };
  },
});
