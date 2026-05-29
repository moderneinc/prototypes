import { Box, type BoxProps } from '@mui/material';
import type { PartialLottieComponentProps } from 'lottie-react';
import dynamic from 'next/dynamic';
import type { FunctionComponent } from 'react';
import animationData from './moddy-spinner.json';

// Importing Lottie dynamically to avoid SSR issues during production builds
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

type ModdySpinnerProps = BoxProps & {
  height?: number;
  aspectRatio?: number;
  slotProps?: {
    lottie?: PartialLottieComponentProps;
  };
};

export const ModdySpinner: FunctionComponent<ModdySpinnerProps> = ({
  height = 50,
  aspectRatio = 1,
  slotProps = {},
  ...rest
}) => {
  return (
    <Box
      {...rest}
      sx={[
        {
          display: 'inline-block',
          height: height,
          width: height * aspectRatio
        },
        ...(Array.isArray(rest.sx) ? rest.sx : [rest.sx])
      ]}
    >
      <Lottie animationData={animationData} loop {...slotProps?.lottie} />
    </Box>
  );
};
