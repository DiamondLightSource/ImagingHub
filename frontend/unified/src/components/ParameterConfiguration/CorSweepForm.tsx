import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { ajvResolver } from "@hookform/resolvers/ajv";
import CorSweepSchema from "./schemas/CorSweepSchema.json";
import { CorSweepVariables } from "./schemas/CorSweepVariables";

const SweepConfigBox = () => {
  return <></>;
};

const TestComp = () => {
  const { handleSubmit } = useFormContext();
  return (
    <form
      onSubmit={handleSubmit((data) => {
        console.log(data);
      })}
    >
      <SweepConfigBox />
    </form>
  );
};

const TestCompWrapper = () => {
  const data = useForm<CorSweepVariables>({
    resolver: ajvResolver(CorSweepSchema)
  });

  return (
    <FormProvider {...data}>
      <TestComp />
    </FormProvider>
  );
};

export default TestCompWrapper;
