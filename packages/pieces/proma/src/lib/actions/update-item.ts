import {  createAction } from '@activepieces/pieces-framework';
import { promaProps } from '../common/props';
import { updateTableRow } from '../common/data';
import { promaAuth } from '../..';

export const updatePromaRow = createAction({
  name: 'update_proma_sheet_row', 
  displayName: 'Update Row',
  description: 'Update a row in master sheet',
  auth: promaAuth,
  props: {
    workspace_id: promaProps.workspace_id(true),
    table_id: promaProps.table_id(true, "write"),
    row_id: promaProps.row_id(true),
    dataRow: promaProps.data_row_dynamic(true, false)
  },
  async run(context) {
    const api_key = context.auth;
    const workspace_id = context.propsValue.workspace_id;
    const table_id = context.propsValue.table_id;
    const dataRow = context.propsValue.dataRow;
    const ROWID = context.propsValue.row_id;
    if (api_key && workspace_id && table_id) {
      const temp = await updateTableRow({ api_key, workspace_id, table_id, data: { ROWID, ...dataRow } , matchById:true}).catch(
        () => null
      );
      return { data: temp };
    }
    return null;
  },
});
