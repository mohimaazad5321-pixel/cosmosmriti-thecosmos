import { Component, type ReactNode } from "react";

export class CanvasBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  override componentDidCatch(error: unknown) {
    console.error("3D world failed, showing map fallback", error);
  }
  override render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
