import { useLanguage } from '@/contexts/LanguageContext';

export const useRTLStyles = () => {
  const { isRTL } = useLanguage();

  const rtlClass = (baseClass: string) => {
    if (!isRTL) return baseClass;
    
    // Convert margin and padding classes
    const rtlClasses = baseClass.split(' ').map(className => {
      // Convert margin classes
      if (className.match(/^m[lr]?-/)) {
        return className.replace('ml-', 'mr-').replace('mr-', 'ml-');
      }
      // Convert padding classes
      if (className.match(/^p[lr]?-/)) {
        return className.replace('pl-', 'pr-').replace('pr-', 'pl-');
      }
      // Convert text alignment
      if (className === 'text-left') return 'text-right';
      if (className === 'text-right') return 'text-left';
      // Convert flex direction
      if (className === 'flex-row') return 'flex-row-reverse';
      if (className === 'flex-row-reverse') return 'flex-row';
      // Convert border radius
      if (className.match(/^rounded-[lr]/)) {
        return className
          .replace('rounded-l-', 'rounded-r-')
          .replace('rounded-r-', 'rounded-l-');
      }
      return className;
    });

    return rtlClasses.join(' ');
  };

  const rtlStyle = (style: React.CSSProperties): React.CSSProperties => {
    if (!isRTL) return style;

    const rtlStyles: React.CSSProperties = { ...style };

    // Convert margin and padding
    if (style.marginLeft) {
      rtlStyles.marginRight = style.marginLeft;
      delete rtlStyles.marginLeft;
    }
    if (style.marginRight) {
      rtlStyles.marginLeft = style.marginRight;
      delete rtlStyles.marginRight;
    }
    if (style.paddingLeft) {
      rtlStyles.paddingRight = style.paddingLeft;
      delete rtlStyles.paddingLeft;
    }
    if (style.paddingRight) {
      rtlStyles.paddingLeft = style.paddingRight;
      delete rtlStyles.paddingRight;
    }

    // Convert text alignment
    if (style.textAlign === 'left') rtlStyles.textAlign = 'right';
    if (style.textAlign === 'right') rtlStyles.textAlign = 'left';

    // Convert transforms
    if (style.transform) {
      rtlStyles.transform = style.transform.replace(
        /translate(X|3d)?\(([-\d.]+)px/g,
        (_, dim, val) => `translate${dim || ''}(${-parseFloat(val)}px`
      );
    }

    // Convert positions
    if (style.left !== undefined) {
      rtlStyles.right = style.left;
      delete rtlStyles.left;
    }
    if (style.right !== undefined) {
      rtlStyles.left = style.right;
      delete rtlStyles.right;
    }

    return rtlStyles;
  };

  return {
    rtlClass,
    rtlStyle,
    isRTL
  };
}; 