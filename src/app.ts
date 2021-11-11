import { context, trace } from '@opentelemetry/api';

const tracer = trace.getTracer('default');

const addClickListener = (id: string, cb?: () => void) => {
  document.addEventListener('click', context.bind(context.active(), () => {
    console.log('%c Click: Listener ' + id, 'font-weight: bold');
    trace.getSpan(context.active())?.setAttribute('handler.id', id);
    if (cb) cb();
  }));
};

const render = () => {
  const app = document.createElement('div')!;
  app.id = 'app';
  app.innerHTML = `<h1>opentelemetry examples</h1>`;
  document.body.append(app);
};

const setupListeners = () => {
  // These will create four unique spans with no relationship between each other.
  addClickListener('0');
  addClickListener('1', async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    console.log('Click 2: Received data');
    if (response.ok) console.log('Click 2: Successfully fetched data');
    else console.error('Click 2: Failed to fetch data');
  });
  addClickListener('2', () => {
    setTimeout(() => {
      console.log('Click 3: running setTimeout');
    });
  });
  addClickListener('3');

  // Ideally, they are automatically grouped together or form a parent relationship
  // Even with a manual instrumentation such as this, it does not form a parent relationship.
  // Weirdly, when you inspect zones directly, you can see that the zone relationship is correct.
  tracer.startActiveSpan('grouped click', async (span) => {
    return new Promise<void>(resolve => {
      for (let i = 0; i < 4; i++) {
        addClickListener(
          'Grouped ' + i,
          () => {
            if (i >= 3) {
              span.end();
              resolve();
            }
          },
        );
      }
    });
  });
};

export const app = () => {
  render();
  setupListeners();
};
