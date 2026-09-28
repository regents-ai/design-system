defmodule Regent.AgentMetadataTest do
  use ExUnit.Case, async: true
  import Phoenix.Component
  import Phoenix.LiveViewTest

  test "the share picture's size prints only when the caller knows it" do
    assigns = %{}

    sized =
      rendered_to_string(~H"""
      <Regent.AgentMetadata.head
        title="Home"
        description="The site"
        canonical="https://example.test/"
        site_name="Example"
        image="https://example.test/mark.png"
        image_width={1024}
        image_height={512}
        image_alt="The site mark"
        structured_data={%{}}
      />
      """)

    assert sized =~ ~s(<meta property="og:image:width" content="1024">)
    assert sized =~ ~s(<meta property="og:image:height" content="512">)

    unsized =
      rendered_to_string(~H"""
      <Regent.AgentMetadata.head
        title="A post"
        description="A post's summary"
        canonical="https://example.test/blog/a-post"
        site_name="Example"
        image="https://example.test/images/a-post.png"
        image_alt="The post's cover"
        structured_data={%{}}
      />
      """)

    assert unsized =~
             ~s(<meta property="og:image" content="https://example.test/images/a-post.png">)

    assert unsized =~
             ~s(<meta name="twitter:image" content="https://example.test/images/a-post.png">)

    refute unsized =~ "og:image:width"
    refute unsized =~ "og:image:height"
  end
end
