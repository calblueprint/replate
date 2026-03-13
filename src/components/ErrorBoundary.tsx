import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedEntry from '@/components/AnimatedEntry';
import AnimatedPressable from '@/components/AnimatedPressable';
import colors from '@/styles/colors';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // log to console in dev, could wire up to a reporting service later
    console.error('[ErrorBoundary]', error.message, errorInfo.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 bg-white justify-center items-center px-8">
          <AnimatedEntry from={{ opacity: 0, scale: 0.9 }} duration={400}>
            <View className="items-center">
              <Ionicons
                name="alert-circle-outline"
                size={48}
                color={colors.neutral[400]}
                style={{ marginBottom: 16 }}
              />
              <Text className="text-xl font-heading text-neutral-800 text-center mb-2">
                Something went wrong
              </Text>
              <Text className="text-sm font-body text-neutral-500 text-center mb-8 leading-5">
                An unexpected error occurred. Please try again.
              </Text>

              <AnimatedPressable
                className="bg-primary-400 rounded-xl py-3.5 px-10 items-center justify-center min-h-[48px]"
                onPress={this.handleRetry}
                scaleValue={0.97}
                accessibilityRole="button"
                accessibilityLabel="Try again"
              >
                <Text className="text-base font-subheading text-white">
                  Try Again
                </Text>
              </AnimatedPressable>
            </View>
          </AnimatedEntry>
        </View>
      );
    }

    return this.props.children;
  }
}
