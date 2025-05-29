import React, { useState } from "react";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Button } from "@/components/ui/button"; // Optional UI

const REGION = "us-west-2"; // Your bucket region

// ❌ DO NOT include credentials in frontend in production
const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: "ASIAX3EDBB53OBDMSJ57",
    secretAccessKey: "c3/UYG6rYKoXed9yTThv2hOA1yxZssiEUSRsKazK",
  },
});

const DownloadCsvFromS3: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setLoading(true);
    setError(null);

    try {
      const command = new GetObjectCommand({
        Bucket: "cleaneddata007",
        Key: "data.csv",
      });

      const url = await getSignedUrl(s3Client, command, { expiresIn: 60 }); // expires in 60s

      const link = document.createElement("a");
      link.href = url;
      link.download = "data.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download error:", err);
      setError("Failed to download CSV file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button onClick={handleDownload} disabled={loading}>
        {loading ? "Downloading..." : "Download CSV"}
      </Button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default DownloadCsvFromS3;
