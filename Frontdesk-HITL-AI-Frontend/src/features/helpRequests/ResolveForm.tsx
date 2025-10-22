import React, { useEffect, useRef, useState } from "react";
import type { HelpRequest } from "../../types";
import { resolveRequest } from "./helpRequest.service";
import { Button } from "../../components/ui/button";

type Props = {
  request: HelpRequest;
  onCancel: () => void;
  onResolved: () => void;
  publishTTS: (text: string) => void;
};

const ResolveForm: React.FC<Props> = ({
  request,
  onCancel,
  onResolved,
  publishTTS,
}) => {
  const [answer, setAnswer] = useState("");
  const ref = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  const submit = async () => {
    if (!answer.trim()) return alert("Enter an answer");

    const data = await resolveRequest(request._id, answer.trim());

    if (data.resolvedAnswer) {
      publishTTS(data.resolvedAnswer);
    }

    onResolved();
  };
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      <div className="bg-white rounded p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-2">Resolve Request</h3>
        <p className="mb-3 text-gray-700">{request.question}</p>
        <textarea
          ref={ref}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={5}
          className="w-full border p-2 rounded"
          aria-label="Answer"
        />
        <div className="mt-4 flex justify-end gap-2">
          <Button onClick={onCancel} className="px-4 py-2 rounded bg-gray-200">
            Cancel
          </Button>
          <Button
            onClick={submit}
            className="px-4 py-2 rounded bg-green-600 text-white"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResolveForm;
