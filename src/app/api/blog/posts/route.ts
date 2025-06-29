
import { NextResponse } from 'next/server';
import { submitBlogPost } from '@/actions/blogActions';
import { BlogFormDataSchema } from '@/types';

export async function POST(request: Request) {
  const apiKey = request.headers.get('Authorization')?.replace('Bearer ', '');
  const expectedApiKey = process.env.BLOG_API_SECRET_KEY;

  if (!expectedApiKey || expectedApiKey === 'generate-a-strong-random-string-here') {
    console.error('BLOG_API_SECRET_KEY is not set in the environment variables.');
    return NextResponse.json(
      { success: false, error: 'Server configuration error. API key is not configured.' },
      { status: 500 }
    );
  }

  if (!apiKey || apiKey !== expectedApiKey) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Invalid or missing API key.' },
      { status: 401 }
    );
  }

  try {
    const requestData = await request.json();

    const validationResult = BlogFormDataSchema.safeParse(requestData);

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request body.', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }
    
    const postData = validationResult.data;

    // The `submitBlogPost` action can handle both creation and updates.
    // This API endpoint should only handle creation.
    const result = await submitBlogPost(postData);

    if (result.success && result.postId) {
      return NextResponse.json(
        { success: true, postId: result.postId, message: 'Blog post created successfully.' },
        { status: 201 } // 201 Created is more appropriate
      );
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to create blog post.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing blog post creation request:', error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ success: false, error: 'Invalid JSON in request body.' }, { status: 400 });
    }
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
