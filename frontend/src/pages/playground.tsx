import AppDialog from "@/components/global/AppDialog";
import { HomeCharacterCustomizer } from "@/components/home/HomeCharacterCustomizer";
import {
  CreateSpaceForm,
  CreateSpaceSelectMapTemplateForm,
  CreateSpaceSelectTypeForm,
} from "@/components/home/HomeCreateSpace";
import { NextPage } from "next";
import React from "react";

const Playground: NextPage = () => {
  return (
    <main className="bg-void w-screen h-screen flex flex-col items-center justify-center">
      <AppDialog content={<CreateSpaceSelectMapTemplateForm />}>
        <button>Create space</button>
      </AppDialog>
      <AppDialog width={"sm:max-w-[500px]"} content={<CreateSpaceForm />}>
        <button>Create space 2</button>
      </AppDialog>
      <AppDialog
        width={"sm:max-w-[450px]"}
        content={<HomeCharacterCustomizer />}
      >
        <button>Open character editor</button>
      </AppDialog>
    </main>
  );
};

export default Playground;
