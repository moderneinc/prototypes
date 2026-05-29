import { Box } from '@mui/material';
import type { Meta, StoryFn } from '@storybook/nextjs';
import { ModdySpinner } from './moddy-spinner.component';

export default {
  title: 'Components/Moddy/Spinner',
  component: ModdySpinner,
  argTypes: {
    height: {
      control: 'number'
    },
    aspectRatio: {
      control: 'number'
    }
  }
} as Meta;

export const SpinnerExample: StoryFn = (args) => (
  <Box
    sx={{
      fontSize: '50px'
    }}
  >
    <ModdySpinner {...args} />
  </Box>
);
