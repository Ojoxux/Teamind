import { fetchApi } from './fetchApi';

/**
 * サムネイル生成APIを呼び出す関数
 * @param videoId 動画ID
 * @param filePath 動画ファイルのパス
 * @returns サムネイル情報
 */
export async function generateThumbnail(
  videoId: string,
  filePath: string
): Promise<{ thumbnailPath: string; thumbnailUrl: string }> {
  try {
    console.log('サムネイル生成API呼び出し開始:', { videoId, filePath });

    // バックエンドAPIを呼び出す
    const response = await fetchApi('/api/thumbnails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        videoId,
        filePath,
      }),
    });

    console.log('サムネイル生成API呼び出し結果:', response);

    if (response.error) {
      throw new Error(response.error);
    }

    return {
      thumbnailPath: response.thumbnailPath,
      thumbnailUrl: response.thumbnailUrl,
    };
  } catch (error) {
    console.error('サムネイル生成API呼び出しエラー:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'サムネイル生成中に予期しないエラーが発生しました'
    );
  }
}
