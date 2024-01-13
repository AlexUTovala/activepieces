import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod, AuthenticationType } from '@activepieces/pieces-common';
import { zendeskAuth } from '../../index';

export const respondToTicketAction = createAction({
  auth: zendeskAuth,
  name: 'respond_to_ticket',
  displayName: 'Respond to Ticket',
  description: 'Respond to a specific ticket in Zendesk',
  props: {
    ticket_id: Property.ShortText({
      displayName: 'Ticket ID',
      description: 'The ID of the ticket to respond to',
      required: true,
    }),
    response_message: Property.LongText({
      displayName: 'Response Message',
      description: 'The message to respond with',
      required: true,
    }),
  },
  run: async ({ auth, propsValue }) => {
    const { ticket_id, response_message } = propsValue;
    const response = await httpClient.sendRequest({
      url: `https://${auth.subdomain}.zendesk.com/api/v2/tickets/${ticket_id}`,
      method: HttpMethod.POST,
      authentication: {
        type: AuthenticationType.BASIC,
        username: auth.email + '/token',
        password: auth.token,
      },
      body: {
        ticket: {
          comment: { 
            body: response_message 
          }
        }
      },
    });
    return response.body;
  },
});
