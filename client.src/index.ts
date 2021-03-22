main();

function main(): void
{
	const outputElement = document.querySelector( 'output' );
	
	if ( !outputElement )
	{
		return;
	}

	const socket = new WebSocket( 'ws://localhost:8000' );

	socket.addEventListener(
		'message',
		( event ) =>
		{
			const messages: string[] = JSON.parse( event.data );
			
			outputElement.textContent = messages.join( '\n' );
		},
	);
	
	const formElement = document.querySelector( 'form' );
	
	if ( !formElement )
	{
		return;
	}
	
	formElement.addEventListener(
		'submit',
		( event ) =>
		{
			event.preventDefault();
			
			const input = formElement.elements.namedItem( 'message' );
			
			if ( !( input instanceof HTMLInputElement ) )
			{
				return;
			}
			
			socket.send( input.value );
			input.value = '';
		},
	);
}
