import { MantineProvider, Title } from '@mantine/core';
import '@mantine/core/styles.css';

const Options = () => {
  return (
    <MantineProvider>
      <div className="flex h-screen items-center justify-center">
        <Title order={1}>This is a Options</Title>
      </div>
    </MantineProvider>
  );
};

export default Options;
