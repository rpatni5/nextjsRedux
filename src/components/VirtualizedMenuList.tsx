'use client';

import React from 'react';
import { MenuItem } from '@mui/material';
import { FixedSizeList } from 'react-window';

export interface VirtualizedMenuListProps extends React.ComponentPropsWithoutRef<'div'> {
  items?: any[];
  height?: number;
  itemHeight?: number;
  labelKey?: string;
  valueKey?: string;
}

const VirtualizedMenuList = React.forwardRef<HTMLDivElement, VirtualizedMenuListProps>(
  (
    {
      items = [],
      height = 4,
      itemHeight = 48,
      labelKey = '',
      valueKey = '',
      ...other
    },
    ref
  ) => {
    return (
      <div ref={ref} {...other}>
        <FixedSizeList
          height={Math.min(height, items.length) * itemHeight}
          width="100%"
          itemSize={itemHeight}
          itemCount={items.length}
          itemData={items}
        >
          {({ index, style, data }) => {
            const item = data[index];
            console.log("renderd item ------  ", item.screenName)
            return (
              <MenuItem key={item[valueKey]} value={item[valueKey]} style={style}>
                {item[labelKey]}
              </MenuItem>
            );
          }}
        </FixedSizeList>
      </div>
    );
  }
);

export default VirtualizedMenuList;

// useMemo is used to remember the result of a calculation. It runs synchronously
//          during render, so the value is available immediately. It’s helpful when
//          you have expensive calculations and you don’t want them to run on every 
//          render unless inputs change.

// useCallback is similar to useMemo, but instead of caching a value, 
//          it caches a function. It helps prevent unnecessary re-creation of functions, 
//         especially when passing them to child components.

// React.memo is used to wrap a component so it only re-renders when its props change. 
//          It’s like telling React: “Don’t re-render this unless you really have to.”


// React.lazy lets you load components only when needed.
//            It helps reduce the initial page load time by splitting code into
//            smaller chunks that load as users navigate.

// Virtualization is a technique where only the visible items in a list are rendered,
//                instead of the whole list. This greatly boosts performance when displaying large data sets.

//    useEffect(() => { ... })                Runs after every render – use when you need to track all changes.
//    useEffect(() => { ... }, [])            Runs once after mount – perfect for initial API calls or setup.
//    useEffect(() => { ... }, [dep])         Runs on mount and whenever dep changes – great for reacting to state/prop change
//    useEffect(() => { return () => { ... }; }, [])   
//                                   Cleans up before re-running when dep changes – 
//                                    useful for resetting effects like intervals or subscriptions.

// useEffect(() => { return () => { ... }; }, [dep])   
//               Cleans up before re-running when dep changes – useful for resetting effects like intervals or subscriptions.


// The cleanup function in useEffect is returned from the effect function.
// It's used to tear down or cancel things like timers, subscriptions, or listeners.
// In your example, it clears an interval to prevent it from running after unmounting.
// Without cleanup, your app risks memory leaks and unwanted behavior.