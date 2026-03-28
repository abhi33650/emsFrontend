'use server'

import { JSX } from "react";

export interface Tabb {
    value: string;
    icon: JSX.Element | undefined;
    label: string; 
    disabled: boolean;
    category?:string;
  }