import { ComponentProps, JSXElementConstructor, ReactElement, useMemo } from 'react';

type ComponentConstructors =
  | keyof JSX.IntrinsicElements
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | JSXElementConstructor<any>;

export type ComponentsType<Component extends ComponentConstructors = ComponentConstructors> =
  | [Component]
  | [Component, ComponentProps<Component>];

export interface ComposeComponentsProps<ComponentsTypes extends readonly ComponentsType[]> {
  components: ComponentsTypes;
  children?: ReactElement | null;
}

export const ComposeComponents = <ComponentsTypes extends readonly ComponentsType[]>({
  components,
  children = null,
}: ComposeComponentsProps<ComponentsTypes>): ReactElement | null => {
  const componentsTree = useMemo(() => {
    return components.reduceRight((tree, [Component, props]) => {
      return <Component {...props}>{tree}</Component>;
    }, children);
  }, [children, components]);

  return componentsTree;
};
