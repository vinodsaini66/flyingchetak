import { Main } from './Main';
import { SocketProvider } from '../../context/SocketContext';

export const Game = () => {
	return (
		<>
		<SocketProvider>
			<Main/>
		</SocketProvider>
		</>
		)

};
