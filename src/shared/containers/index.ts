import { createContainer } from 'awilix';
import { registerServices } from './registerServices';

const container = createContainer({ injectionMode: 'CLASSIC' });

registerServices(container);

export { container };
