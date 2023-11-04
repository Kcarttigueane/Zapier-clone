import React from 'react';
import { SvgXml } from 'react-native-svg';

global.Buffer = global.Buffer || require('buffer').Buffer;

interface Base64SvgDisplayProps {
  base64Svg: string;
  width?: number;
  height?: number;
}

const Base64SvgDisplay: React.FC<Base64SvgDisplayProps> = ({ base64Svg, width, height }) => {
  const decodeSvgService = Buffer.from(base64Svg, 'base64').toString('utf-8');

  return <SvgXml xml={decodeSvgService} width={width} height={height} />;
};

export default Base64SvgDisplay;
