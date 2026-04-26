'use client';

import { useDispatch, useSelector, useStore } from 'react-redux';

import type { AppDispatch, RootState } from '@/store/index';
import { store } from '@/store/index';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<typeof store>();
