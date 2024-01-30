import { DynamicPropsValue, Property } from '@activepieces/pieces-framework';
import { Table, TableColumn, Workspace } from './types';
import {
  getTableColumns,
  getTableRowProps,
  getTables,
  getWorkSpaces,
  optionalTimeFormats,
  timeFormat,
  timeFormatDescription,
  timeZoneOptions,
} from './data';

const FieldMapping = {
  ShortText: Property.ShortText,
  LongText: Property.LongText,
  Number: Property.Number,
  StaticDropdown: Property.StaticDropdown,
  StaticMultiSelectDropdown: Property.StaticMultiSelectDropdown,
  Checkbox: Property.Checkbox,
};

export const promaProps = {
  table_name: (required = false) =>
    Property.ShortText({ displayName: 'Master Sheet Name', required }),
  acl: (required = false) =>
    Property.StaticDropdown({
      displayName: 'Access',
      required,
      defaultValue: 'private',
      options: {
        disabled: false,
        placeholder: '',
        options: [
          { label: 'Private', value: 'private' },
          { label: 'Public', value: 'public' },
          { label: 'Inherit from workspace', value: 'inherit' },
        ],
      },
    }),
  column_name: (required = false) =>
    Property.ShortText({ displayName: 'Column Name', required }),
  column_data_type: (required = false) =>
    Property.StaticDropdown({
      displayName: 'Column Data Type',
      required,
      options: {
        disabled: false,
        placeholder: 'Select data type',
        options: [
          { label: 'text', value: 'text' },
          { label: 'number', value: 'number' },
          { label: 'email', value: 'email' },
          { label: 'url', value: 'url' },
          { label: 'time', value: 'time' },
          { label: 'date', value: 'date' },
          { label: 'image', value: 'image' },
          { label: 'markdown', value: 'markdown' },
          { label: 'multiSelect', value: 'multiSelect' },
          { label: 'file', value: 'file' },
          { label: 'tel', value: 'tel' },
          { label: 'team members', value: 'teamMembers' },
        ],
      },
    }),
  workspace_id: (required = false, mode = 'read') =>
    Property.Dropdown({
      displayName: 'Workspace',
      description: "The workspace's unique identifier.",
      required: required,
      refreshers: ['auth'],
      options: async ({ auth }) => {
        if (!auth)
          return {
            disabled: true,
            placeholder: 'connect your account first',
            options: [],
          };

        const response: Workspace[] | null = await getWorkSpaces(
          auth as string,
          mode as string
        );

        if (!response)
          return {
            disabled: true,
            placeholder: 'Invalid API key',
            options: [],
          };

        const options = (response || []).map((el) => ({
          label: el.name,
          value: el.ROWID,
        }));

        return {
          disabled: false,
          options: options,
        };
      },
    }),
  table_id: (required = false, mode = 'read') =>
    Property.Dropdown({
      displayName: 'Master Sheet',
      description: '',
      required: required,
      refreshers: ['auth', 'workspace_id'],
      options: async ({ auth, workspace_id }) => {
        if (!auth)
          return {
            disabled: true,
            placeholder: 'connect your account first',
            options: [],
          };
        if (!workspace_id)
          return {
            disabled: true,
            placeholder: 'select a workspace first',
            options: [],
          };

        const response: Table[] | null = await getTables(
          auth as string,
          workspace_id as string,
          mode
        );

        if (!response)
          return {
            disabled: true,
            placeholder: 'Invalid API key',
            options: [],
          };

        const options = (response || []).map((el) => ({
          label: el.name,
          value: el.ROWID,
        }));

        return {
          disabled: false,
          options: options,
        };
      },
    }),
  column_id: (required = false, label?: string, dataType?: string) =>
    Property.Dropdown({
      displayName: label || 'Column Name',
      description: '',
      required: required,
      refreshers: ['auth', 'table_id'],
      options: async ({ auth, table_id }) => {
        const api_key = auth;
        if (!api_key)
          return {
            disabled: true,
            placeholder: 'connect your account first',
            options: [],
          };
        if (!table_id)
          return {
            disabled: true,
            placeholder: 'select a master sheet first',
            options: [],
          };

        const response: TableColumn[] | null = await getTableColumns(
          api_key as string,
          table_id as string
        );

        if (!response)
          return {
            disabled: true,
            placeholder: 'Invalid API key',
            options: [],
          };

        const options = (response || [])
          .filter((el) => (dataType ? el.dataType === dataType : true))
          .map((el) => ({
            label: el.columnNmae,
            value: el.ROWID,
          }));

        return {
          disabled: false,
          options: options,
        };
      },
    }),
  data_row_dynamic: (required = false, search = false) => {
    return Property.DynamicProperties({
      displayName: search ? 'Search Condition' : 'Form',
      description: search
        ? 'Enter conditions to match when searching rows'
        : 'Enter value for columns',
      required,
      defaultValue: {},
      refreshers: ['auth', 'table_id'],
      props: async (propsValue) => {
        const auth = propsValue.auth as unknown as string;
        const table_id = propsValue.table_id as unknown as string;
        const tableRowProps = await getTableRowProps(auth, table_id, search);

        const fields: DynamicPropsValue = {};

        tableRowProps?.forEach?.((trp) => {
          if (
            trp.type === 'StaticDropdown' ||
            trp.type === 'StaticMultiSelectDropdown'
          ) {
            const properties = {
              ...trp.properties,
              required: !!trp.properties?.required,
              options: trp.properties?.options
                ? { options: trp.properties.options }
                : { options: [] },
            };
            fields[trp.id] = FieldMapping[trp.type](properties);
          } else {
            const properties = {
              ...trp.properties,
              required: !!trp.properties?.required,
            };
            fields[trp.id] = FieldMapping[trp.type](properties);
          }
        });

        return fields;
      },
    });
  },
  row_id: (required = false) =>
    Property.ShortText({ displayName: 'Row ID', required, description: '' }),
  time_format: () =>
    Property.StaticDropdown({
      displayName: 'To Time Format',
      description: timeFormatDescription,
      options: {
        options: optionalTimeFormats,
      },
      required: true,
      defaultValue: timeFormat.format00,
    }),

  time_zone: () =>
    Property.StaticDropdown<string>({
      displayName: 'Time Zone',
      options: {
        options: timeZoneOptions,
      },
      required: true,
      defaultValue: 'UTC',
    }),
};
