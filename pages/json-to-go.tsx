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
  customTag: string;
  omitempty: boolean;
  usePointers: boolean;
}

const defaultSettings: Settings = {
  inline: true,
  customTag: "",
  omitempty: true,
  usePointers: false
};

function normalizeSettings(value: Partial<Settings>): Settings {
  return {
    inline: value.inline !== false,
    customTag: typeof value.customTag === "string" ? value.customTag : "",
    omitempty: value.omitempty !== false,
    usePointers: value.usePointers === true
  };
}

const formFields = [
  {
    type: InputType.SWITCH,
    key: "inline",
    label: "Inline Nested Structs"
  },
  {
    type: InputType.TEXT_INPUT,
    key: "customTag",
    label: "Custom Extra Tag (e.g. msgpack)"
  },
  {
    type: InputType.SWITCH,
    key: "omitempty",
    label: "Use omitempty (all fields)"
  },
  {
    type: InputType.SWITCH,
    key: "usePointers",
    label: "Use pointers"
  }
];

export default function JsonToGo() {
  const name = "JSON to Go Struct";
  const [rawSettings, setSettings] = useSettings(name, defaultSettings);
  const settings = normalizeSettings(rawSettings || {});

  const transformer = useCallback(
    async ({ value }) => {
      return gofmt(
        jsonToGo(value, undefined, {
          inline: settings.inline,
          customTag: settings.customTag,
          omitempty: settings.omitempty,
          usePointers: settings.usePointers
        }).go
      );
    },
    [settings]
  );

  const getSettingsElement = useCallback<EditorPanelProps["settingElement"]>(
    ({ open, toggle }) => {
      return (
        <Form<Settings>
          title={name}
          onSubmit={values => setSettings(normalizeSettings(values))}
          open={open}
          toggle={toggle}
          formsFields={formFields}
          initialValues={settings}
        />
      );
    },
    [settings, setSettings]
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
