// AI Client - Replicate API integration for virtual try-on
// Uses fetch directly to avoid requiring replicate npm package at build time

export interface TryOnResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

export async function createTryOnMockup(
  bodyImageUrl: string,
  designImageUrl: string,
  customMeasurements?: Record<string, number> | null
): Promise<TryOnResult> {
  const replicateToken = process.env.REPLICATE_API_TOKEN;

  if (!replicateToken) {
    // Return a mock result if no API token configured
    return {
      success: true,
      imageUrl: designImageUrl,
    };
  }

  try {
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${replicateToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: 'c871bb9b046607b680449ecbae55fd8c6d945e0a1948644bf2361b3d021d3ff4',
        input: {
          human_img: bodyImageUrl,
          garm_img: designImageUrl,
          garment_des: 'Bangladeshi three-piece dress',
          category: 'upper_body',
        },
      }),
    });

    if (!response.ok) {
      return { success: false, error: 'AI service error' };
    }

    const prediction = await response.json();

    // Poll for result
    let result = prediction;
    let attempts = 0;
    while (result.status !== 'succeeded' && result.status !== 'failed' && attempts < 30) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
        headers: { 'Authorization': `Token ${replicateToken}` },
      });
      result = await pollRes.json();
      attempts++;
    }

    if (result.status === 'succeeded' && result.output) {
      const outputUrl = Array.isArray(result.output) ? result.output[0] : result.output;
      return { success: true, imageUrl: outputUrl };
    }

    return { success: false, error: 'Processing failed' };
  } catch (err) {
    console.error('AI client error:', err);
    return { success: false, error: 'Network error' };
  }
}

export async function generateDesignImage(
  prompt: string,
  style?: string
): Promise<TryOnResult> {
  const replicateToken = process.env.REPLICATE_API_TOKEN;

  if (!replicateToken) {
    return {
      success: false,
      error: 'REPLICATE_API_TOKEN not configured',
    };
  }

  try {
    const fullPrompt = `${prompt}, Bangladeshi fashion, three-piece dress, ${style || 'traditional'} style, high quality fabric texture`;

    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${replicateToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: 'ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4',
        input: {
          prompt: fullPrompt,
          width: 768,
          height: 768,
          num_outputs: 1,
        },
      }),
    });

    if (!response.ok) {
      return { success: false, error: 'AI service error' };
    }

    const prediction = await response.json();

    let result = prediction;
    let attempts = 0;
    while (result.status !== 'succeeded' && result.status !== 'failed' && attempts < 30) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
        headers: { 'Authorization': `Token ${replicateToken}` },
      });
      result = await pollRes.json();
      attempts++;
    }

    if (result.status === 'succeeded' && result.output) {
      const outputUrl = Array.isArray(result.output) ? result.output[0] : result.output;
      return { success: true, imageUrl: outputUrl };
    }

    return { success: false, error: 'Processing failed' };
  } catch (err) {
    console.error('AI client error:', err);
    return { success: false, error: 'Network error' };
  }
}
