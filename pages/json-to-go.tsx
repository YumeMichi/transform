import ConversionPanel from "@components/ConversionPanel";
import { EditorPanelProps } from "@components/EditorPanel";
import Form, { InputType } from "@components/Form";
import { useSettings } from "@hooks/useSettings";
import { useCallback } from "react";
import * as React from "react";
import jsonToGo from "@utils/jsonToGo";
import gofmt from "gofmt.js";

interface Settings {
  inline: boolean;
}

const formFields = [
  {
    type: InputType.SWITCH,
    key: "inline",
    label: "Inline Nested Structs"
  }
];

export default function JsonToGo() {
  const name = "JSON to Go Struct";
  const [settings, setSettings] = useSettings(name, {
    inline: true
  });

  const transformer = useCallback(
    async ({ value }) => {
      return gofmt(jsonToGo(value, undefined, { inline: settings.inline }).go);
    },
    [settings]
  );

  const getSettingsElement = useCallback<EditorPanelProps["settingElement"]>(
    ({ open, toggle }) => {
      return (
        <Form<Settings>
          title={name}
          onSubmit={setSettings}
          open={open}
          toggle={toggle}
          formsFields={formFields}
          initialValues={settings}
        />
      );
    },
    []
  );

  return (
    <ConversionPanel
      transformer={transformer}
      editorTitle="JSON"
      editorLanguage="json"
      resultTitle="Go"
      resultLanguage={"go"}
      editorSettingsElement={getSettingsElement}
      settings={settings}
    />
  );
}
