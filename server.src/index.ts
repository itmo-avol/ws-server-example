import WebSocket from 'ws';
import config from './config.json';

const server = new WebSocket.Server(
	{
		port: config.webSocketPort,
	},
	() =>
	{
		const address = server.address();
		
		console.log(
			'WebSocket in listening on port '
			+ (
				typeof address === 'string'
				? address
				: address.port
			),
		);
	},
);

const messages: string[] = [];

server.on(
	'connection',
	( ws ) =>
	{
		ws.on( 'message', onClientMessage );
		ws.send(
			JSON.stringify( messages ),
			onSendError,
		);
	},
);

function onClientMessage( this: WebSocket, data: WebSocket.Data ): void
{
	if ( typeof data !== 'string' )
	{
		this.send(
			JSON.stringify( {
				message: 'Wrong data type',
			} )
		);
		
		return;
	}
	
	messages.push( data );
	broadcastMessages();
}

function broadcastMessages(): void
{
	for ( const client of server.clients )
	{
		if ( client.readyState === WebSocket.OPEN )
		{
			client.send(
				JSON.stringify( messages ),
				onSendError,
			);
		}
	}
}

function onSendError( error?: Error )
{
	if ( error )
	{
		console.error( error );
	}
}
