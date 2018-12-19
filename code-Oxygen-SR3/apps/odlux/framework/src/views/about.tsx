import * as React from 'react';

import { withComponents, WithComponents } from '../utilities/withComponents';

const components = {
  'counter': 'demoApp.counter'
};

const AboutComponent = (props: WithComponents<typeof components>) => {
  return (
    <div>
      <h2>About</h2>
      <props.components.counter />
    </div>
  )
};

export const About = withComponents(components)(AboutComponent);
export default About;