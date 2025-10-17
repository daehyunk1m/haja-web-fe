import Section from "./bulletList/Section";

export default function Body() {
  return (
    <div className='w-full flex flex-col flex-1 items-center pt-0.5 pr-3.5 pb-0.5 pl-0.5'>
      <Section>
        <Section.Container position='right'>
          <Section.Tab />
          <Section.List type='task' />
        </Section.Container>
      </Section>
      <Section>
        <Section.Container position='left'>
          <Section.Tab />
          <Section.List type='someday' />
        </Section.Container>
      </Section>
    </div>
  );
}
