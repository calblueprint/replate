import React from 'react';
import { SvgUri } from 'react-native-svg';

const LOGO_URI =
  'https://replate-storage.s3.us-west-1.amazonaws.com/assets/logos/logo-color.svg';

interface ReplateLogoProps {
  size?: number;
}

export default function ReplateLogo({ size = 140 }: ReplateLogoProps) {
  return (
    <SvgUri
      uri={LOGO_URI}
      width={size}
      height={size}
      accessibilityLabel="Replate logo"
    />
  );
}
