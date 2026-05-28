/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Note {
  id: string;
  title: string;
  category: "Electronics" | "AI & ML" | "Embedded Systems" | "Personal";
  content: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export interface SkillItem {
  name: string;
  level: number;
  icon: string;
  tags: string[];
  description: string;
}

export interface IotDevice {
  id: string;
  name: string;
  status: "ONLINE" | "STANDBY" | "OFFLINE";
  telemetry: {
    temperature: number;
    voltage: number;
    current: number;
    frequency: number;
  };
}
