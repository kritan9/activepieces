import { HttpMethod, httpClient } from '@activepieces/pieces-common';
import {
  OrganizationResponse,
  Organization,
  TableResponse,
  TableRowResponse,
  Table,
  TableColumn,
  TableColumnResponse,
  TableRow,
  Workspace,
  WorkspaceResponse,
  Webhook,
  WebhookResponse,
  TableRowProp,
  TableRowPropsResponse,
} from './types';
import _ from 'lodash';

export const parseJSON = (x: string, returnNull = false) => {
  try {
    if (!_.isString(x)) return x;
    return JSON.parse(x);
  } catch (e) {
    if (returnNull) return null;
    return x;
  }
};

export const PROMA_SERVER_URL =
  'https://pipeline-759987269.catalystserverless.com/api/oauth';
// 'https://pipeline-759987269.development.catalystserverless.com/api/oauth';

export async function getOrganizations(
  api_key: string
): Promise<Organization[]> {
  const response = await httpClient.sendRequest<OrganizationResponse>({
    url: `${PROMA_SERVER_URL}/getorganizations`,
    method: HttpMethod.GET,
    headers: {},
    queryParams: { api_key },
  });
  return response.body.data;
}

export async function getWorkSpaces(
  api_key: string,
  mode = 'read'
): Promise<Workspace[]> {
  const response = await httpClient.sendRequest<WorkspaceResponse>({
    url: `${PROMA_SERVER_URL}/getworkspaces`,
    method: HttpMethod.GET,
    queryParams: { api_key, mode },
  });
  return response.body.data;
}

export async function getTables(
  api_key: string,
  workspace_id: string,
  mode = 'read'
): Promise<Table[]> {
  const response = await httpClient.sendRequest<TableResponse>({
    url: `${PROMA_SERVER_URL}/gettables`,
    method: HttpMethod.GET,
    headers: {},
    queryParams: { space_id: workspace_id, api_key, mode },
  });
  return response.body.data;
}

export async function getTableRows(
  api_key: string,
  table_id: string,
  data: any,
  mode = 'read'
): Promise<TableRow[]> {
  if (!table_id) return [];
  const response = await httpClient.sendRequest<TableRowResponse>({
    url: `${PROMA_SERVER_URL}/tablerows/search`,
    method: HttpMethod.POST,
    body: { table_id, api_key, mode, data },
    queryParams: { api_key },
  });
  return response.body.data;
}

export async function getTableColumns(
  api_key: string,
  table_id: string,
  mode = 'read'
): Promise<TableColumn[]> {
  if (!table_id) return [];
  const response = await httpClient.sendRequest<TableColumnResponse>({
    url: `${PROMA_SERVER_URL}/gettablecolumns`,
    method: HttpMethod.GET,
    queryParams: { table_id, api_key, mode },
  });
  return response.body.data;
}

export async function getTableRowProps(
  api_key: string,
  table_id: string,
  search = false
): Promise<TableRowProp[]> {
  if (!table_id) return [];
  const response = await httpClient.sendRequest<TableRowPropsResponse>({
    url: `${PROMA_SERVER_URL}/tablerow/props/get`,
    method: HttpMethod.GET,
    queryParams: { table_id, api_key, search: search ? '1' : '' },
  });
  return response.body.data;
}

export async function storeWebhookUrl({
  api_key,
  table_id,
  workspace_id,
  webhook_url,
  trigger_type,
  column_id,
}: {
  api_key: string;
  table_id?: string;
  workspace_id?: string;
  webhook_url: string;
  trigger_type: string;
  column_id?: string;
}): Promise<Webhook> {
  const response = await httpClient.sendRequest<WebhookResponse>({
    url: `${PROMA_SERVER_URL}/webhook/create`,
    method: HttpMethod.POST,
    body: {
      table_id,
      webhook_url,
      trigger_type,
      workspace_id,
      api_key,
      column_id,
    },
    queryParams: { api_key },
  });
  return response.body.data;
}

export async function removeWebhookUrl({
  id,
  api_key,
}: {
  id: string;
  api_key: string;
}): Promise<{ ROWID: string }> {
  const response = await httpClient.sendRequest<WebhookResponse>({
    url: `${PROMA_SERVER_URL}/webhook/delete`,
    method: HttpMethod.POST,
    body: { ROWID: id, api_key },
    queryParams: { api_key },
  });
  return response.body?.data;
}

export async function insertTableRow({
  workspace_id,
  table_id,
  data,
  api_key,
  matchById = true,
}: {
  api_key: string;
  table_id: string;
  workspace_id: string;
  data: unknown;
  matchById: boolean;
}): Promise<TableRow> {
  const response = await httpClient.sendRequest<{ data: TableRow }>({
    url: `${PROMA_SERVER_URL}/tablerow/add`,
    method: HttpMethod.POST,
    body: {
      workspace_id,
      table_id,
      data,
      api_key,
      matchById,
    },
    queryParams: { api_key },
  });
  return response.body.data;
}

export async function updateTableRow({
  workspace_id,
  table_id,
  data,
  api_key,
  matchById = true,
}: {
  api_key: string;
  table_id: string;
  workspace_id: string;
  data: any;
  matchById: boolean;
}): Promise<TableRow | null> {
  if (!data?.ROWID) return null;
  const response = await httpClient.sendRequest<{ data: TableRow }>({
    url: `${PROMA_SERVER_URL}/tablerow/update`,
    method: HttpMethod.POST,
    body: {
      workspace_id,
      table_id,
      data,
      api_key,
      matchById,
    },
    queryParams: { api_key },
  });
  return response.body.data;
}

export async function insertTableColumn({
  workspace_id,
  table_id,
  data,
  api_key,
}: {
  api_key: string;
  table_id: string;
  workspace_id: string;
  data: unknown;
}): Promise<TableColumn> {
  const response = await httpClient.sendRequest<{ data: TableColumn }>({
    url: `${PROMA_SERVER_URL}/tablecolumn/add`,
    method: HttpMethod.POST,
    body: {
      workspace_id,
      table_id,
      data,
      api_key,
    },
    queryParams: { api_key },
  });
  return response.body.data;
}

export async function insertTable({
  workspace_id,
  data,
  api_key,
}: {
  api_key: string;
  workspace_id: string;
  data: unknown;
}): Promise<Table> {
  const response = await httpClient.sendRequest<{ data: Table }>({
    url: `${PROMA_SERVER_URL}/table/add`,
    method: HttpMethod.POST,
    body: {
      workspace_id,
      data,
      api_key,
    },
    queryParams: { api_key },
  });
  return response.body.data;
}
