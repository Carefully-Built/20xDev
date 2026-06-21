import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const contactStatusValidator = v.union(
  v.literal('new'),
  v.literal('qualified'),
  v.literal('proposal'),
  v.literal('customer'),
);

const contactCustomFieldValidator = v.array(
  v.object({
    fieldDefinitionId: v.string(),
    valueType: v.union(
      v.literal('text'),
      v.literal('long_text'),
      v.literal('number'),
      v.literal('boolean'),
      v.literal('date'),
      v.literal('single_select'),
      v.literal('multi_select'),
      v.literal('json'),
    ),
    textValue: v.optional(v.string()),
    numberValue: v.optional(v.number()),
    booleanValue: v.optional(v.boolean()),
    dateValue: v.optional(v.number()),
    stringListValue: v.optional(v.array(v.string())),
    jsonValue: v.optional(v.any()),
  }),
);

const contactFields = {
  name: v.string(),
  company: v.string(),
  address: v.optional(v.string()),
  role: v.optional(v.string()),
  email: v.optional(v.string()),
  phone: v.optional(v.string()),
  owner: v.optional(v.string()),
  status: contactStatusValidator,
  value: v.optional(v.number()),
  googlePlaceId: v.optional(v.string()),
  customFields: v.optional(contactCustomFieldValidator),
  latitude: v.optional(v.number()),
  longitude: v.optional(v.number()),
  notes: v.optional(v.string()),
};

export const contactsTable = defineTable({
  ...contactFields,
  organizationId: v.string(),
  createdBy: v.id('users'),
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index('by_organization', ['organizationId'])
  .index('by_status', ['organizationId', 'status'])
  .index('by_created', ['organizationId', 'createdAt']);

export const createContactValidator = v.object({
  ...contactFields,
});

export const updateContactValidator = v.object({
  ...contactFields,
  name: v.optional(contactFields.name),
  company: v.optional(contactFields.company),
  status: v.optional(contactStatusValidator),
});
